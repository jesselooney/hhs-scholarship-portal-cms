import { ExportButton } from "./components/ExportButton";

export default {
  register() {}, // Don't remove this or it breaks
  bootstrap(app: any) {
    app.injectContentManagerComponent("listView", "actions", {
      name: "export-csv",
      Component: ExportButton,
    });
  },
};