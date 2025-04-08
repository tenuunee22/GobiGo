import React, { useState, useRef } from "react";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { sendPhoneVerificationCode, verifyPhoneCode } from "@/lib/firebase";

// Define schemas for validation
const phoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, { message: "Утасны дугаар хэт богино байна." })
    .max(14, { message: "Утасны дугаар хэт урт байна." })
    .regex(/^\+?[0-9]+$/, { message: "Зөвхөн тоо оруулна уу." }),
});

const verificationSchema = z.object({
  code: z
    .string()
    .min(6, { message: "Баталгаажуулах код 6 оронтой байна." })
    .max(6, { message: "Баталгаажуулах код 6 оронтой байна." })
    .regex(/^[0-9]+$/, { message: "Зөвхөн тоо оруулна уу." }),
});

interface PhoneLoginFormProps {
  onToggleForm: () => void;
}

export function PhoneLoginForm({ onToggleForm }: PhoneLoginFormProps) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState<"phone" | "verification">("phone");
  const [loading, setLoading] = useState(false);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const confirmationResultRef = useRef<any>(null);

  // Form for phone number input
  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  // Form for verification code input
  const verificationForm = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: "",
    },
  });

  // Format the phone number to include +976 if needed
  const formatPhoneNumber = (phoneNumber: string) => {
    // Remove any non-digit characters
    let digitsOnly = phoneNumber.replace(/\D/g, "");
    
    // If it doesn't start with country code, add Mongolia country code
    if (!digitsOnly.startsWith("976")) {
      // If it's 8 digits, it's likely a Mongolian number without the leading 0
      if (digitsOnly.length === 8) {
        return `+976${digitsOnly}`;
      }
      // If it has a leading 0, remove it and add country code
      if (digitsOnly.startsWith("0")) {
        return `+976${digitsOnly.substring(1)}`;
      }
    } else {
      // If it already has the country code but missing the +
      return `+${digitsOnly}`;
    }
    
    // If none of the above, add + if missing
    return phoneNumber.startsWith("+") ? phoneNumber : `+${phoneNumber}`;
  };

  const onSubmitPhoneNumber = async (values: z.infer<typeof phoneSchema>) => {
    try {
      setLoading(true);
      const formattedPhoneNumber = formatPhoneNumber(values.phoneNumber);
      
      // Make sure recaptcha container exists
      if (!recaptchaContainerRef.current) {
        throw new Error("reCAPTCHA container not found");
      }

      // Send verification code
      const confirmationResult = await sendPhoneVerificationCode(
        formattedPhoneNumber,
        "recaptcha-container"
      );
      
      confirmationResultRef.current = confirmationResult;
      setStep("verification");
      
      toast({
        title: "Баталгаажуулах код илгээгдлээ",
        description: "Таны утсанд баталгаажуулах код илгээлээ.",
      });
    } catch (error: any) {
      console.error("Error sending verification code:", error);
      toast({
        title: "Алдаа гарлаа",
        description: error.message || "Баталгаажуулах код илгээхэд алдаа гарлаа.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmitVerificationCode = async (values: z.infer<typeof verificationSchema>) => {
    try {
      setLoading(true);
      
      if (!confirmationResultRef.current) {
        throw new Error("Баталгаажуулах код илгээгдээгүй байна.");
      }
      
      await verifyPhoneCode(confirmationResultRef.current, values.code);
      
      toast({
        title: "Амжилттай нэвтэрлээ",
        description: "Та амжилттай нэвтэрлээ.",
      });
      
      // Navigate to home page after successful login
      setLocation("/");
    } catch (error: any) {
      console.error("Error verifying code:", error);
      toast({
        title: "Алдаа гарлаа",
        description: error.message || "Баталгаажуулах код буруу байна.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Утасны дугаараар нэвтрэх</CardTitle>
      </CardHeader>
      <CardContent>
        {step === "phone" ? (
          <>
            <Form {...phoneForm}>
              <form
                onSubmit={phoneForm.handleSubmit(onSubmitPhoneNumber)}
                className="space-y-4"
              >
                <FormField
                  control={phoneForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Утасны дугаар</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Таны утасны дугаар (99112233 эсвэл +97699112233)"
                          {...field}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Container for reCAPTCHA */}
                <div id="recaptcha-container" ref={recaptchaContainerRef}></div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Илгээж байна..." : "Баталгаажуулах код авах"}
                </Button>
              </form>
            </Form>

            <div className="mt-4 text-center">
              <Button
                variant="link"
                className="text-sm"
                onClick={onToggleForm}
              >
                Имэйл хаягаар нэвтрэх
              </Button>
            </div>
          </>
        ) : (
          <>
            <Form {...verificationForm}>
              <form
                onSubmit={verificationForm.handleSubmit(onSubmitVerificationCode)}
                className="space-y-4"
              >
                <FormField
                  control={verificationForm.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Баталгаажуулах код</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="6 оронтой код"
                          {...field}
                          disabled={loading}
                          maxLength={6}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Шалгаж байна..." : "Нэвтрэх"}
                </Button>
              </form>
            </Form>

            <div className="mt-4 text-center">
              <Button
                variant="link"
                className="text-sm"
                onClick={() => setStep("phone")}
                disabled={loading}
              >
                Өөр утасны дугаар оруулах
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}