import React, { FC } from "react";
import { css } from "styled-components";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Select, { SelectPresentationProps } from "@insite/mobius/Select";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect, ResolveThunks } from "react-redux";
import setCurrency from "@insite/client-framework/Store/Context/Handlers/SetCurrency";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import translate from "@insite/client-framework/Translate";
import { getCurrencies } from "@insite/client-framework/Store/Context/ContextSelectors";

const enum fields {
    showIcon = "showIcon",
}

const mapStateToProps = (state: ApplicationState) => ({
    currencies: getCurrencies(state),
    currentCurrencyId: state.context.session.currency?.id,
    currentCurrencySymbol: state.context.session.currency?.currencySymbol,
});

const mapDispatchToProps = {
    setCurrency,
};

export interface CurrencyMenuStyles {
    currencyWrapper?: InjectableCss;
    currencySelect?: SelectPresentationProps;
    currencySymbol?: TypographyPresentationProps;
}

const styles: CurrencyMenuStyles = {
    currencyWrapper: {
        css: css` display: flex; `,
    },
    currencySelect: {
        backgroundColor: "common.accent",
        cssOverrides: {
            formInputWrapper: css` width: 100px; `,
            inputSelect: css`
                border: none;
                text-transform: uppercase;
            `,
        },
    },
    currencySymbol: {
        size: 22,
        css: css` margin-top: 3px; `,
    },
};

interface OwnProps extends WidgetProps {
    fields: {
        [fields.showIcon]: boolean;
    };
}

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export const currencyMenuStyles = styles;
const CurrencyMenu: FC<Props> = ({ currencies, currentCurrencyId, currentCurrencySymbol, fields, setCurrency }) => {
    if (!currencies || currencies.length <= 1) {
        return null;
    }

    const menuId = "currencyMenu";

    return (
        <StyledWrapper {...styles.currencyWrapper}>
            {fields.showIcon
                ? <Typography {...styles.currencySymbol}>{currentCurrencySymbol}</Typography>
                : null
            }
            <VisuallyHidden as="label" id={`${menuId}-label`} htmlFor={menuId}>
                {translate("Currency")}
            </VisuallyHidden>
            <Select
                {...styles.currencySelect}
                uid={menuId}
                onChange={event => setCurrency({ currencyId: event.currentTarget.value })}
                value={currentCurrencyId}>
                {currencies.map(c => (
                    <option value={c.id} key={c.id}>{c.currencyCode}</option>
                ))}
            </Select>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(CurrencyMenu),
    definition: {
        displayName: "Currency Menu",
        icon: "Menu",
        fieldDefinitions: [
            {
                name: fields.showIcon,
                displayName: "Show Icon",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 1,
            },
        ],
        group: "Common",
    },
};

export default widgetModule;