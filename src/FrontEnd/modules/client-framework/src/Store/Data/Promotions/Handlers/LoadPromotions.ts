import {
    ApiHandler,
    createHandlerChainRunner,

} from "@insite/client-framework/HandlerCreator";
import {
    getCartPromotions,
    GetCartPromotionsApiParameter,
} from "@insite/client-framework/Services/CartService";
import { PromotionCollectionModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<GetCartPromotionsApiParameter, PromotionCollectionModel>;

export const DispatchBeginLoadPromotions: HandlerType = props => {
    props.dispatch({
        type: "Data/Promotions/BeginLoadPromotions",
        parameter: props.parameter,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.parameter };
};

export const GetPromotions: HandlerType = async props => {
    props.apiResult = await getCartPromotions(props.apiParameter);
};

export const DispatchCompleteLoadPromotions: HandlerType = props => {
    props.dispatch({
        type: "Data/Promotions/CompleteLoadPromotions",
        collection: props.apiResult,
        parameter: props.parameter,
    });
};

export const chain = [
    DispatchBeginLoadPromotions,
    PopulateApiParameter,
    GetPromotions,
    DispatchCompleteLoadPromotions,
];

const loadPromotions = createHandlerChainRunner(chain, "LoadPromotions");
export default loadPromotions;
