import Allsongs from "@/src/Allsongs";
import FrontendLayout from "@/layouts/FrontendLayout";

export default function Home() {
  return (
    <div className="min-h-screen">

      <FrontendLayout>
        <Allsongs />
      </FrontendLayout>



    </div>
  );
}
