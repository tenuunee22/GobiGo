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
const phoneSchema = z.object({
  phoneNumber: z
    .string()
    .length(8, { message: "Утасны дугаар 8 оронтой байх ёстой." })
    .regex(/^[0-9]+$/, { message: "Зөвхөн тоо оруулна уу." }),
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
  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });
  const verificationForm = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: "",
    },
  });
  const formatPhoneNumber = (phoneNumber: string) => {
    let digitsOnly = phoneNumber.replace(/\D/g, "");
    return `+976${digitsOnly}`;
  };
  const onSubmitPhoneNumber = async (values: z.infer<typeof phoneSchema>) => {
    try {
      setLoading(true);
      const formattedPhoneNumber = formatPhoneNumber(values.phoneNumber);
      if (!recaptchaContainerRef.current) {
        throw new Error("reCAPTCHA container not found");
      }
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
                        <div className="flex">
                          <div className="bg-gray-100 flex items-center px-3 border border-r-0 rounded-l-md border-input">
                            +976
                          </div>
                          <Input
                            className="rounded-l-none"
                            placeholder="99112233"
                            {...field}
                            disabled={loading}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              field.onChange(value);
                            }}
                            maxLength={8}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {}
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