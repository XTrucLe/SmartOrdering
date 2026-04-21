// General | Operations | Config |Theme 

import ConfigTab from "../components/tabs/Config";
import GeneralTab from "../components/tabs/General";
import OperationsTab from "../components/tabs/Operations";


export const HEADER_TABS = [
    {
        label: "General",
        value: "general",
        component: GeneralTab,
    },
    {
        label: "Operations",
        value: "operations",
        component: OperationsTab,
    },
    {
        label: "Config",
        value: "config",
        component: ConfigTab,
    },

]

