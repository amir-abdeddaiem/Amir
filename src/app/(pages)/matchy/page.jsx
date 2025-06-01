import MainLayout from "@/components/Matchy/main-layout";
import SwipeInterface from "@/components/Matchy/swipe-interface";
import { FilterModalProvider } from "@/hooks/use-filter-modal";
import { MatchModalProvider } from "@/hooks/use-match-modal";

export default function matchy() {
  return (
    <div>
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
