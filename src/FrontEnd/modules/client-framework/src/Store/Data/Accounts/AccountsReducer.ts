import { Draft } from "immer";
import { AccountModel } from "@insite/client-framework/Types/ApiModels";
import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { AccountsState } from "@insite/client-framework/Store/Data/Accounts/AccountsState";

const initialState: AccountsState = {
    isLoading: {},
    byId: {},
    dataViews: {},
};

const reducer = {
    "Data/Accounts/BeginLoadAccount": (draft: Draft<AccountsState>, action: { id: string }) => {
        draft.isLoading[action.id] = true;
    },

    "Data/Accounts/CompleteLoadAccount": (draft: Draft<AccountsState>, action: { model: AccountModel, overriddenId?: string }) => {
        const id = action.overriddenId || action.model.id;
        delete draft.isLoading[id];
        draft.byId[id] = action.model;
    },

    "Data/Accounts/Reset": () => {
        return initialState;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);