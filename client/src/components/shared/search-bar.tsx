import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchResults } from "./search-results";
import { Search, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
interface SearchBarProps {
  placeholder?: string;
  expandOnMobile?: boolean;
}
export function SearchBar({ 
  placeholder = "Хайх...", 
  expandOnMobile = true 
}: SearchBarProps) {
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setExpanded(false);
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    if (query.trim()) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [query]);
  if (!isMobile || !expandOnMobile) {
    return (
      <div className="relative w-full" ref={searchRef}>
        <div className="relative">
          <Input
            type="search"
            placeholder={placeholder}
            className="pl-9 pr-4 rounded-full h-10 shadow-sm border-muted"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowResults(true)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full p-0"
              onClick={() => setQuery("")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        <SearchResults
          query={query}
          isVisible={showResults}
          onClose={() => setShowResults(false)}
        />
      </div>
    );
  }
  return (
    <div className="relative" ref={searchRef}>
      <AnimatePresence>
        {expanded ? (
          <motion.div 
            initial={{ width: "40px", opacity: 0.8 }}
            animate={{ width: "100%", opacity: 1 }}
            exit={{ width: "40px", opacity: 0.8 }}
            transition={{ duration: 0.2 }}
            className="flex items-center"
          >
            <Input
              type="search"
              placeholder={placeholder}
              className="pl-9 pr-10 rounded-full h-10 shadow-sm border-muted"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full p-0"
              onClick={() => {
                setExpanded(false);
                setQuery("");
                setShowResults(false);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-10 w-10"
              onClick={() => setExpanded(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <SearchResults
        query={query}
        isVisible={expanded && showResults}
        onClose={() => {
          setShowResults(false);
          setExpanded(false);
        }}
      />
    </div>
  );
}
