import { AppLineChart } from "@/components/analytics/Chart";
import CodeAnalytics from "@/components/analytics/CodeAnalytics";
import { NavBar } from "@/components/dashboard/NavBar";
interface Props {
  params: { code: string };
  // searchParams: { payload?: string }; // option we can send data within the file here
}
const page = async ({ params }: Props) => {
  const { code } = await params;

  // let extraData = null;

  // if (searchParams.payload) {
  //   extraData = JSON.parse(searchParams.payload);
  // }
  return (
    <section className="w-full min-h-screen">
      <NavBar />
      <CodeAnalytics code={code} />
    </section>
  );
};

export default page;
