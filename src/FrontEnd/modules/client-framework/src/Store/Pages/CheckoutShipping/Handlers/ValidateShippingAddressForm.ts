import { Handler, HasOnSuccess, createHandlerChainRunner, makeHandlerChainAwaitable } from "@insite/client-framework/HandlerCreator";
import { CustomerValidationDto, AddressFieldDisplayCollectionModel, ShipToModel } from "@insite/client-framework/Types/ApiModels";
import validateAddress, { AddressErrors } from "@insite/client-framework/Store/CommonHandlers/ValidateAddress";

type HandlerType = Handler<{
    address: ShipToModel;
    validation: CustomerValidationDto;
    fieldDisplay: AddressFieldDisplayCollectionModel;
} & HasOnSuccess<boolean>, {
    formErrors: AddressErrors;
}>;

export const ValidateAddress: HandlerType = async props => {
    const awaitableValidate = makeHandlerChainAwaitable<Parameters<typeof validateAddress>[0], AddressErrors>(validateAddress);
    props.formErrors = await awaitableValidate({
        address: props.parameter.address,
        validationRules: props.parameter.validation!,
        addressFieldDisplayCollection: props.parameter.fieldDisplay,
    })(props.dispatch, props.getState);
};

export const SetFormErrors: HandlerType = props => {
    props.dispatch({
        type: "Pages/CheckoutShipping/SetShippingAddressFormErrors",
        formErrors: props.formErrors,
    });
};

export const FireOnSuccess: HandlerType = props => {
    props.parameter.onSuccess?.(Object.keys(props.formErrors).length === 0);
};

export const chain = [
    ValidateAddress,
    SetFormErrors,
    FireOnSuccess,
];

const validateShippingAddressForm = createHandlerChainRunner(chain, "ValidateShippingAddressForm");
export default validateShippingAddressForm;