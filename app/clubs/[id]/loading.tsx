import LoadingClubDetails from "./(ClubDetails)/LoadingClubDetails";
import LoadingHoldingList from "./(Portfolio)/LoadingHoldingList";
import LoadingWidgetSectionWrapper from "./(Widget)/LoadingWidgetSectionWrapper";

export default function Loading() {
  return (
    <div className="md:max-w-[1000px] w-full md:mx-auto h-full md:flex md:flex-row md:items-start md:gap-6 flex flex-col gap-8 animate-pulse">
      <div className="flex flex-col items-start gap-8 w-full">
        <LoadingClubDetails />
        <LoadingHoldingList />
      </div>
      <div className="flex flex-col gap-5 md:w-2/5">
        <LoadingWidgetSectionWrapper />
      </div>
    </div>
  );
}
