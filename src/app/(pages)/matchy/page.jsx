import MainLayout from "@/components/waw/main-layout";
import SwipeInterface from "@/components/waw/swipe-interface";
import { FilterModalProvider } from "../../hooks/use-filter-modal";
import { MatchModalProvider } from "../../hooks/use-match-modal";

export default function Home() {
  return (
    <div className="bg-[#F0F5E7]">
      <FilterModalProvider>
        <MatchModalProvider>
          <MainLayout>
            <SwipeInterface />
          </MainLayout>
        </MatchModalProvider>
      </FilterModalProvider>
    </div>
  );
}
