import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Phone, MapPin, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/auth-context";
interface ChatMessage {
  id: string;
  text: string;
  sender: "customer" | "driver" | "system";
  timestamp: Date;
  status: "sending" | "sent" | "delivered" | "read";
  attachmentUrl?: string;
}
interface DeliveryChatProps {
  orderId: string;
  customerName: string;
  customerImage?: string;
  driverName: string;
  driverImage?: string;
  initialMessages?: ChatMessage[];
  onSendMessage?: (message: string) => void;
  onClose?: () => void;
}
export function DeliveryChat({
  orderId,
  customerName,
  customerImage,
  driverName,
  driverImage,
  initialMessages = [],
  onSendMessage,
  onClose,
}: DeliveryChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userRole = user?.role || "customer";
  const isCustomer = userRole === "customer";
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "system-1",
          text: `Сайн байна уу, ${isCustomer ? driverName : customerName} таны хоол захиалга амжилттай захиалагдлаа. Хэрэгтэй зүйл байвал чатаар холбогдоно уу.`,
          sender: "system",
          timestamp: new Date(),
          status: "delivered",
        },
      ]);
    }
  }, [isCustomer, customerName, driverName, messages.length]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const message: ChatMessage = {
      id: Date.now().toString(),
      text: newMessage,
      sender: isCustomer ? "customer" : "driver",
      timestamp: new Date(),
      status: "sending",
    };
    setMessages((prev) => [...prev, message]);
    setNewMessage("");
    if (onSendMessage) {
      onSendMessage(newMessage);
    }
    setTimeout(() => {
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === message.id 
            ? { ...msg, status: "delivered" } 
            : msg
        )
      );
      if (Math.random() > 0.5) {
        const delay = 1000 + Math.random() * 2000;
        const responses = [
          "За, ойлголоо!",
          "Байрлал руу очиж байна",
          "Хэдэн минутын дараа очно",
          "Хаалганы код хэрэгтэй юу?",
          "Баярлалаа!",
        ];
        setTimeout(() => {
          const responseMsg: ChatMessage = {
            id: Date.now().toString(),
            text: responses[Math.floor(Math.random() * responses.length)],
            sender: isCustomer ? "driver" : "customer",
            timestamp: new Date(),
            status: "delivered",
          };
          setMessages((prev) => [...prev, responseMsg]);
        }, delay);
      }
    }, 800);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      className="delivery-chat-container fixed bottom-4 right-4 z-40 w-full max-w-sm bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
      style={{ maxHeight: isExpanded ? "500px" : "56px" }}
    >
      {}
      <div className="chat-header p-3 bg-gradient-to-r from-primary/90 to-primary-foreground/90 text-white flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative">
            <Avatar className="h-8 w-8 border-2 border-white/50">
              <AvatarImage src={isCustomer ? driverImage : customerImage} />
              <AvatarFallback className="bg-primary-foreground text-white">
                {isCustomer ? driverName.charAt(0) : customerName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
          </div>
          <div className="ml-2">
            <p className="font-medium text-sm">
              {isCustomer ? driverName : customerName}
            </p>
            <p className="text-xs text-white/80">Хүргэлтийн захиалга #{orderId}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20 rounded-full">
                  <Phone className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Залгах</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-white hover:bg-white/20 rounded-full"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Хаах</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="chat-body bg-gray-50"
          >
            {}
            <div className="messages-container h-80 overflow-y-auto p-3 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "system"
                      ? "justify-center"
                      : message.sender === (isCustomer ? "customer" : "driver")
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {message.sender === "system" ? (
                    <div className="system-message bg-gray-200 text-gray-600 rounded-lg py-1 px-3 text-xs max-w-[80%]">
                      {message.text}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`message flex items-end space-x-1 max-w-[80%] ${
                        message.sender === (isCustomer ? "customer" : "driver")
                          ? "flex-row-reverse space-x-reverse"
                          : ""
                      }`}
                    >
                      {message.sender !== (isCustomer ? "customer" : "driver") && (
                        <Avatar className="h-6 w-6 flex-shrink-0">
                          <AvatarImage 
                            src={message.sender === "customer" ? customerImage : driverImage} 
                          />
                          <AvatarFallback className={`${
                            message.sender === "customer" ? "bg-blue-500" : "bg-green-500"
                          } text-white text-xs`}>
                            {message.sender === "customer" ? customerName.charAt(0) : driverName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`message-bubble ${
                        message.sender === (isCustomer ? "customer" : "driver")
                          ? "bg-primary text-white"
                          : "bg-white border border-gray-200 text-gray-800"
                      } rounded-2xl p-2 px-3 shadow-sm`}>
                        {message.attachmentUrl && (
                          <div className="attached-image mb-2">
                            <img 
                              src={message.attachmentUrl} 
                              alt="Attachment" 
                              className="rounded-lg w-full max-h-32 object-cover"
                            />
                          </div>
                        )}
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                        <p className="text-right text-xs opacity-70 mt-1">
                          {formatTime(message.timestamp)}
                          {message.sender === (isCustomer ? "customer" : "driver") && (
                            <span className="ml-1">
                              {message.status === "sending" ? "⌛" : 
                               message.status === "sent" ? "✓" : 
                               message.status === "delivered" ? "✓✓" : 
                               "✓✓"}
                            </span>
                          )}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            {}
            <div className="message-input p-2 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="flex-shrink-0 h-9 w-9 rounded-full text-gray-500">
                        <MapPin className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Байршил илгээх</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="flex-shrink-0 h-9 w-9 rounded-full text-gray-500">
                        <Image className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Зураг илгээх</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Input
                  type="text"
                  placeholder="Мессеж бичих..."
                  className="flex-grow border-gray-200"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className={`flex-shrink-0 h-9 w-9 rounded-full ${
                    newMessage.trim() ? "text-primary" : "text-gray-400"
                  }`}
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}