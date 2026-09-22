import { ArchivePanels } from "./archive-panels";

export function ArchiveWrapper() {
  return (
    <div className="bg-background pt-28 pb-[calc(7rem+env(safe-area-inset-bottom))] md:pt-[72px] md:pb-0">
      <ArchivePanels />
    </div>
  );
}
