import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { SearchResults } from "./search-results";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useIsMobile } from "@/hooks/use-mobile";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  expandOnMobile?: boolean;
}

export function SearchBar({ 
  className, 
  placeholder = "Рестораны нэр, хоол, хүргэлт хайх...", 
  expandOnMobile = true 
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [location] = useLocation();
  const isMobile = useIsMobile();

  // Гаднах click илрүүлэх
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        
        if (expandOnMobile && isMobile) {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [expandOnMobile, isMobile]);

  // URL өөрчлөгдөхөд хайлтын үр дүнг хаах
  useEffect(() => {
    setShowResults(false);
    if (expandOnMobile && isMobile) {
      setIsExpanded(false);
    }
  }, [location, expandOnMobile, isMobile]);

  // Хайлтын нөхцөл
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.length > 0) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  // Хайлтын талбар цэвэрлэх
  const clearSearch = () => {
    setQuery("");
    setShowResults(false);
  };

  // Хайлтын талбар дээр дарах үед утаснуудад тохируулсан өргөтгөл
  const handleSearchFocus = () => {
    if (expandOnMobile && isMobile) {
      setIsExpanded(true);
    }
    setShowResults(true);
  };

  return (
    <div 
      ref={searchRef} 
      className={`relative ${className || ""} ${isExpanded ? "w-full" : ""}`}
    >
      <div className="relative">
        <motion.div
          animate={{
            width: expandOnMobile && isMobile && isExpanded ? "100%" : "auto",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`flex items-center ${
            expandOnMobile && isMobile && !isExpanded ? "w-10" : "w-full"
          }`}
        >
          {expandOnMobile && isMobile && !isExpanded ? (
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-10 h-10 p-0"
              onClick={() => setIsExpanded(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          ) : (
            <div className="relative w-full flex items-center">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={handleSearchInput}
                onFocus={handleSearchFocus}
                placeholder={placeholder}
                className="pl-10 pr-10 py-2 h-10"
              />
              {query.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full w-10 p-0"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              
              {expandOnMobile && isMobile && isExpanded && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 whitespace-nowrap"
                  onClick={() => {
                    setIsExpanded(false);
                    setShowResults(false);
                  }}
                >
                  Буцах
                </Button>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Хайлтын үр дүн */}
      {showResults && (
        <SearchResults
          query={query}
          isVisible={showResults}
          onClose={() => {
            setShowResults(false);
            if (expandOnMobile && isMobile) {
              setIsExpanded(false);
            }
          }}
        />
      )}
    </div>
  );
}