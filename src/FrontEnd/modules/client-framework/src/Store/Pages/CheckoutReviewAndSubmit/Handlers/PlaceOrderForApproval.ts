import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
    HasOnSuccess,
} from "@insite/client-framework/HandlerCreator";
import {
    Cart,
    CartResult,
    UpdateCartApiParameter,
    updateCartWithResult,
} from "@insite/client-framework/Services/CartService";
import { getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";

type HandlerType = ApiHandlerDiscreteParameter<HasOnSuccess<string>, UpdateCartApiParameter, CartResult>;

export const DispatchBeginPlaceOrderForApproval: HandlerType = props => {
    props.dispatch({
        type: "Pages/CheckoutReviewAndSubmit/BeginPlaceOrderForApproval",
    });
};

export const PopulateApiParameter: HandlerType = props => {
    const cartState = getCurrentCartState(props.getState());

    if (!cartState.value) {
        throw new Error("There was no current cart and we are trying to place the current cart as an order.");
    }

    props.apiParameter = {
        cart: {
            ...cartState.value,
            status: "AwaitingApproval",
        },
    };
};

export const UpdateCart: HandlerType = async props => {
    const result = await updateCartWithResult(props.apiParameter);
    if (result.successful) {
        props.apiResult = result.result;
    } else {
        props.dispatch({
            type: "Pages/CheckoutReviewAndSubmit/SetPlaceOrderErrorMessage",
            errorMessage: result.errorMessage,
        });
        props.dispatch({
            type: "Pages/CheckoutReviewAndSubmit/CompletePlaceOrderForApproval",
        });
        return false;
    }
};

export const ReloadCurrentCart: HandlerType = props => {
    props.dispatch(loadCurrentCart());
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess && props.parameter.onSuccess(props.apiResult.cart.id);
};

export const DispatchCompletePlaceOrderForApproval: HandlerType = props => {
    props.dispatch({
        type: "Pages/CheckoutReviewAndSubmit/CompletePlaceOrderForApproval",
    });
};

export const DispatchResetOrders: HandlerType = props => {
    props.dispatch({
        type: "Data/Orders/Reset",
    });
};

export const chain = [
    DispatchBeginPlaceOrderForApproval,
    PopulateApiParameter,
    UpdateCart,
    ReloadCurrentCart,
    ExecuteOnSuccessCallback,
    DispatchCompletePlaceOrderForApproval,
    DispatchResetOrders,
];

const placeOrderForApproval = createHandlerChainRunner(chain, "PlaceOrderForApproval");
export default placeOrderForApproval;
