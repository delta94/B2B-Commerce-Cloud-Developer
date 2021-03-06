import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import sleep from "@insite/client-framework/Common/Sleep";
import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import loadWishLists from "@insite/client-framework/Store/Data/WishLists/Handlers/LoadWishLists";
import { getWishListsDataView } from "@insite/client-framework/Store/Data/WishLists/WishListsSelectors";

interface Parameter {
    productInfos?: Omit<ProductInfo, "productDetailPath">[];
    modalIsOpen: boolean;
}

type HandlerType = Handler<Parameter>;

export const wishListsParameter = {
    filter: "availableToAdd",
    pageSize: 100,
};

export const LoadLists: HandlerType = async props => {
    const getWishListsParameter = props.getState().components.addToListModal.getWishListsParameter;
    if (
        props.parameter.modalIsOpen &&
        props.getState().context.session.isAuthenticated &&
        !getWishListsDataView(props.getState(), getWishListsParameter).value
    ) {
        props.dispatch(loadWishLists(getWishListsParameter));

        for (let x = 0; x < 200; x += 1) {
            if (getWishListsDataView(props.getState(), getWishListsParameter).value) {
                break;
            }
            await sleep(50);
        }
    }
};

export const DispatchCompleteSetAddToListModalIsOpen: HandlerType = props => {
    props.dispatch({
        type: "Components/AddToListModal/CompleteSetIsOpen",
        isOpen: props.parameter.modalIsOpen,
        productInfos: props.parameter.productInfos,
    });
};

export const chain = [LoadLists, DispatchCompleteSetAddToListModalIsOpen];

const setAddToListModalIsOpen = createHandlerChainRunner(chain, "SetAddToListModalIsOpen");
export default setAddToListModalIsOpen;
