import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { Draft } from "immer";
import ContextState from "@insite/client-framework/Store/Context/ContextState";
import { Website } from "@insite/client-framework/Services/WebsiteService";
import { SettingsModel, TokenExConfig } from "@insite/client-framework/Services/SettingsService";
import assign from "lodash/assign";
import { Session } from "@insite/client-framework/Services/SessionService";

const initialState: ContextState = {
    website: {} as Website,
    isWebsiteLoaded: false,
    session: {} as Session,
    isSessionLoaded: false,
    settings: {} as SettingsModel,
    areSettingsLoaded: false,
    tokenExConfigs: {},
    isSigningIn: false,
};

const reducer = {
    "Context/CompleteLoadWebsite": (draft: Draft<ContextState>, action: { website: Website; }) => {
        draft.website = action.website;
        draft.isWebsiteLoaded = true;
    },
    "Context/CompleteLoadSession": (draft: Draft<ContextState>, action: { session: Session; }) => {
        assign(draft.session, action.session);
        draft.isSessionLoaded = true;
    },
    "Context/CompleteLoadSettings": (draft: Draft<ContextState>, action: { settings: SettingsModel; }) => {
        draft.settings = action.settings;
        draft.areSettingsLoaded = true;
    },
    "Context/CompleteLoadTokenExConfig": (draft: Draft<ContextState>, action: { tokenExConfig: TokenExConfig; token?: string; }) => {
        draft.tokenExConfigs[action.token ? action.token : ""] = action.tokenExConfig;
    },
    "Context/BeginSignIn": (draft: Draft<ContextState>) => {
        draft.isSigningIn = true;
    },
    "Context/CompleteSignIn": (draft: Draft<ContextState>) => {
        draft.isSigningIn = false;
    },
    "Context/CompleteSelectProduct": (draft: Draft<ContextState>, action: { productPath: string; }) => {
        draft.selectedProductPath = action.productPath;
    },
    "Context/CompleteSelectCategory": (draft: Draft<ContextState>, action: { categoryPath: string; }) => {
        draft.selectedCategoryPath = action.categoryPath;
    },
    "Context/CompleteSelectBrand": (draft: Draft<ContextState>, action: { brandPath: string; }) => {
        draft.selectedBrandPath = action.brandPath;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);