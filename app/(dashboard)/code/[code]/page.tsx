import { AppLineChart } from "@/components/dashboard/Chart";
import { NavBar } from "@/components/dashboard/NavBar";
import { useLinks } from "@/hooks/useLinks";
import { redirect } from "next/navigation";

interface Props {
  params: { code: string };
}
const page = async ({ params }: Props) => {
  const { code } = await params;

  // const router = useRouter();

  // const { data } = useLinks();
  // const link = data?.find((old) => {
  //   old.code === code;
  // });

  // if (link === undefined || null) {
  //   // router.push("/");
  //   redirect("/");
  // }
  // I know but i got other better approches but this is it for now well change for some other time

  return (
    <section className="w-full min-h-screen">
      <NavBar />

      <div className="w-full max-w-3xl mx-auto px-4 mt-6">
        <div className="w-full h-[300px] md:h-[350px] lg:h-[400px]">
          <AppLineChart code={code} />
        </div>
      </div>
    </section>
  );
};

export default page;
