import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import loadRealTimePricing from "@insite/client-framework/Store/CommonHandlers/LoadRealTimePricing";
import {
    getProductState,
    getVariantChildrenDataView,
} from "@insite/client-framework/Store/Data/Products/ProductsSelectors";
import cloneDeep from "lodash/cloneDeep";

interface Parameter {
    variantTraitId?: string;
    traitValueId?: string;
    productId: string;
}

interface Props {
    variantSelection: SafeDictionary<string>;
    variantSelectionCompleted: boolean;
    selectedProductId?: string;
    productInfo?: ProductInfo;
}

type HandlerType = Handler<Parameter, Props>;

export const CopyCurrentValues: HandlerType = props => {
    const productDetail = props.getState().pages.productDetails;
    props.variantSelection = cloneDeep(productDetail.variantSelection);
};

export const SetVariantSelection: HandlerType = props => {
    if (!props.parameter.variantTraitId) {
        return;
    }

    props.variantSelection[props.parameter.variantTraitId] = props.parameter.traitValueId;
};

export const SetVariantSelectionCompleted: HandlerType = props => {
    const selectedVariantTraitIds = Object.keys(props.variantSelection);
    props.variantSelectionCompleted =
        selectedVariantTraitIds.length > 0 &&
        selectedVariantTraitIds.every(traitValueId => props.variantSelection[traitValueId]);
};

export const SelectVariantProduct: HandlerType = props => {
    props.selectedProductId = props.parameter.productId;

    if (!props.variantSelectionCompleted) {
        return;
    }

    const variantChildren = getVariantChildrenDataView(props.getState(), props.parameter.productId).value!;

    for (const variantChild of variantChildren) {
        let matches = true;
        if (!variantChild.childTraitValues) {
            break;
        }
        for (const childTraitValue of variantChild.childTraitValues) {
            if (props.variantSelection[childTraitValue.styleTraitId] !== childTraitValue.id) {
                matches = false;
                break;
            }
        }

        if (matches) {
            props.selectedProductId = variantChild.id;
            return;
        }
    }
};

export const SetProductInfo: HandlerType = props => {
    const state = props.getState();
    const { productInfosById, selectedProductId } = state.pages.productDetails;
    if (!productInfosById) {
        throw new Error("productInfosById was undefined in the productDetailsState");
    }
    if (!selectedProductId) {
        throw new Error("selectedProductId was undefined in the productDetailsState");
    }

    if (!props.selectedProductId) {
        throw new Error("selectedProductId was undefined in the props for UpdateVariantSelection");
    }

    const currentProductInfo = productInfosById[selectedProductId];
    if (!currentProductInfo) {
        throw new Error(`There was no productInfoById for the id ${selectedProductId}`);
    }
    const newProductInfo = productInfosById[props.selectedProductId];
    if (!newProductInfo) {
        throw new Error(`There was no productInfoById for the id ${props.selectedProductId}`);
    }
    const product = getProductState(state, props.selectedProductId).value;
    if (!product) {
        throw new Error(`There was no product found for the id ${props.selectedProductId}`);
    }

    props.productInfo = {
        ...newProductInfo,
        unitOfMeasure: product.unitOfMeasures!.some(o => o.unitOfMeasure === currentProductInfo.unitOfMeasure)
            ? currentProductInfo.unitOfMeasure
            : newProductInfo.unitOfMeasure,
        qtyOrdered: Math.max(currentProductInfo.qtyOrdered, product.minimumOrderQty),
    };
};

export const LoadRealTimePricing: HandlerType = props => {
    const { productInfo, selectedProductId: productId } = props;
    if (!productInfo || !productId) {
        return;
    }

    props.dispatch(
        loadRealTimePricing({
            productPriceParameters: [productInfo],
            onSuccess: realTimePricing => {
                const pricing = realTimePricing.realTimePricingResults!.find(
                    o => o.productId === productInfo.productId,
                );
                if (pricing) {
                    props.dispatch({
                        type: "Pages/ProductDetails/CompleteLoadRealTimePricing",
                        pricing,
                    });
                } else {
                    props.dispatch({
                        type: "Pages/ProductDetails/FailedLoadRealTimePricing",
                        productId,
                    });
                }
            },
            onError: () => {
                props.dispatch({
                    type: "Pages/ProductDetails/FailedLoadRealTimePricing",
                    productId,
                });
            },
        }),
    );
};

export const DispatchUpdateVariantSelection: HandlerType = props => {
    props.dispatch({
        type: "Pages/ProductDetails/UpdateVariantSelection",
        variantSelection: props.variantSelection,
        variantSelectionCompleted: props.variantSelectionCompleted,
        selectedProductInfo: props.productInfo!,
    });
};

export const chain = [
    CopyCurrentValues,
    SetVariantSelection,
    SetVariantSelectionCompleted,
    SelectVariantProduct,
    SetProductInfo,
    LoadRealTimePricing,
    DispatchUpdateVariantSelection,
];

const updateVariantSelection = createHandlerChainRunner(chain, "UpdateVariantSelection");
export default updateVariantSelection;
