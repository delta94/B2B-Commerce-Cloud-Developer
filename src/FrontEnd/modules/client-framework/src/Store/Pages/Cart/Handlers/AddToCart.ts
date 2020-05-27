import { CartLineModel } from "@insite/client-framework/Types/ApiModels";
import { addProductWithResult, AddProductApiParameter } from "@insite/client-framework/Services/CartService";
import {
    ApiHandler, createHandlerChainRunner, HasOnSuccess,
} from "@insite/client-framework/HandlerCreator";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";

type AddToCartParameter = {
    onError?: (error: string) => void;
} & AddProductApiParameter & HasOnSuccess;

type HandlerType = ApiHandler<AddToCartParameter, CartLineModel>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = props.parameter;
};

export const SendDataToApi: HandlerType = async props => {
    const result = await addProductWithResult(props.apiParameter);
    if (result.successful) {
        props.apiResult = result.result;
    } else {
        props.parameter.onError?.(result.errorMessage);
        return false;
    }
};

export const LoadCart: HandlerType = props => {
    props.dispatch(loadCurrentCart());
};

export const FireOnSuccess: HandlerType = props => {
    props.parameter.onSuccess?.();
};

export const chain = [
    PopulateApiParameter,
    SendDataToApi,
    LoadCart,
    FireOnSuccess,
];

const addToCart = createHandlerChainRunner(chain, "AddToCart");
export default addToCart;