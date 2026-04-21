import ThemePlayground from "@/components/common/ThemePlayground";

function ConfigTab() {
  return (
    <div className="flex-1 flex flex-col p-6 px-8 gap-4">
      <h2 className="text-2xl font-semibold border-b pb-4">Configuration</h2>

      <div className="flex-1">
        <ThemePlayground />
      </div>
    </div>
  );
}

export default ConfigTab;
