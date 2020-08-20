import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import loadRealTimePricing from "@insite/client-framework/Store/CommonHandlers/LoadRealTimePricing";
import { getProductState } from "@insite/client-framework/Store/Data/Products/ProductsSelectors";

type Parameter = {
    unitOfMeasure: string,
    productId: string,
};

type HandlerType = Handler<Parameter>;

export const DispatchChangeUnitOfMeasure: HandlerType = props => {
    props.dispatch({
        type: "Pages/ProductList/ChangeUnitOfMeasure",
        unitOfMeasure: props.parameter.unitOfMeasure,
        productId: props.parameter.productId,
    });
};

export const UpdatePrice: HandlerType = props => {
    const state = props.getState();
    const { productId, unitOfMeasure } = props.parameter;
    const product = getProductState(state, productId).value;
    if (!product || product.quoteRequired) {
        return;
    }

    const productInfo = state.pages.productList.productInfosByProductId[productId];
    if (!productInfo) {
        return;
    }

    props.dispatch(loadRealTimePricing({
        productPriceParameters: [
                {
                    productId,
                    qtyOrdered: productInfo.qtyOrdered,
                    unitOfMeasure: unitOfMeasure ?? "",
                },
            ],
        onSuccess: realTimePricing => {
            const pricing = realTimePricing.realTimePricingResults!.find(o => o.productId === productId);
            if (pricing) {
                props.dispatch({
                    type: "Pages/ProductList/CompleteLoadRealTimePricing",
                    realTimePricing,
                });
            } else {
                props.dispatch({
                    type: "Pages/ProductList/FailedLoadRealTimePricing",
                    productId,
                });
            }
        },
        onError: () => {
            props.dispatch({
                type: "Pages/ProductList/FailedLoadRealTimePricing",
                productId,
            });
        },
    }));
};

export const chain = [
    DispatchChangeUnitOfMeasure,
    UpdatePrice,
];

const changeUnitOfMeasure = createHandlerChainRunner(chain, "ChangeUnitOfMeasure");
export default changeUnitOfMeasure;
