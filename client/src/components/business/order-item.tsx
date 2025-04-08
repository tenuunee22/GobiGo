import React, { useState } from "react";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  Clock, 
  Check, 
  Ban
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface OrderItemProps {
  id: string;
  orderNumber: string;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: string;
  address: string;
  requestedTime: string;
  onStatusChange: () => void;
}

export function OrderItem({
  id,
  orderNumber,
  customerName,
  items,
  total,
  status,
  address,
  requestedTime,
  onStatusChange
}: OrderItemProps) {
  const [open, setOpen] = useState(false);
  
  const getStatusBadge = () => {
    let variant: "default" | "secondary" | "outline" | "destructive" = "default";
    let label = "";
    
    switch (status) {
      case "placed":
        variant = "outline";
        label = "Хүлээгдэж байна";
        break;
      case "preparing":
        variant = "secondary";
        label = "Бэлтгэж байна";
        break;
      case "ready_for_pickup":
        variant = "secondary";
        label = "Авахад бэлэн";
        break;
      case "ready_for_delivery":
        variant = "secondary";
        label = "Хүргэхэд бэлэн";
        break;
      case "ready":
        variant = "default";
        label = "Бэлэн болсон";
        break;
      case "on-the-way":
        variant = "default";
        label = "Хүргэлтэнд гарсан";
        break;
      case "delivered":
        variant = "default";
        label = "Хүргэгдсэн";
        break;
      case "completed":
        variant = "default";
        label = "Дууссан";
        break;
      case "cancelled":
        variant = "destructive";
        label = "Цуцлагдсан";
        break;
      default:
        variant = "outline";
        label = status;
    }
    
    return <Badge variant={variant}>{label}</Badge>;
  };
  
  const getStatusButtonLabel = () => {
    switch (status) {
      case "placed":
        return "Бэлдэж эхлэх";
      case "preparing":
        return "Бэлэн болсон";
      case "ready_for_pickup":
        return "Хүргэгч ирэхийг хүлээж байна";
      case "ready_for_delivery":
        return "Хүргэлтэнд гаргах";
      case "ready":
        return "Хүргэлтэнд гаргах";
      case "on-the-way":
        return "Хүргэгдсэн";
      case "delivered":
        return "Дууссан";
      case "completed":
        return "Дууссан";
      case "cancelled":
        return "Цуцлагдсан";
      default:
        return "Статус шинэчлэх";
    }
  };

  const isActionDisabled = status === "completed" || status === "cancelled";
  
  return (
    <Card className="mb-4">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{orderNumber}</span>
                <span className="text-gray-600">•</span>
                <span>{customerName}</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                <time>{new Date().toLocaleString()}</time>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge()}
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
          
          <CollapsibleContent>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Захиалгын мэдээлэл</h3>
                <div className="grid grid-cols-1 gap-2">
                  {items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {item.quantity} x {item.name}
                      </span>
                      <span className="font-medium">
                        {item.price.toLocaleString()}₮
                      </span>
                    </div>
                  ))}
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Нийт дүн</span>
                  <span>{total.toLocaleString()}₮</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={16} />
                  <span>{address || "Хаяг оруулаагүй"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={16} />
                  <span>{requestedTime}</span>
                </div>
              </div>
              
              <div className="flex justify-between pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={isActionDisabled}
                  onClick={() => {
                    if (window.confirm("Захиалгыг цуцлах уу?")) {
                      // In a real app, this would call an API to cancel the order
                      alert("Захиалга цуцлагдлаа");
                    }
                  }}
                >
                  <Ban size={16} className="mr-1" /> 
                  Цуцлах
                </Button>
                
                <Button 
                  size="sm"
                  disabled={isActionDisabled}
                  onClick={onStatusChange}
                >
                  <Check size={16} className="mr-1" />
                  {getStatusButtonLabel()}
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </CardContent>
      </Collapsible>
    </Card>
  );
}