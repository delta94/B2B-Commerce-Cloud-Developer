import { parserOptions } from "@insite/client-framework/Common/BasicSelectors";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { BrandStateContext } from "@insite/client-framework/Store/Data/Brands/BrandsSelectors";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { BrandDetailsPageContext } from "@insite/content-library/Pages/BrandDetailsPage";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import parse from "html-react-parser";
import React, { FC, useContext } from "react";
import { css } from "styled-components";

interface Props extends WidgetProps {
}

export interface BrandDetailsContentStyles {
    container?: InjectableCss;
}

export const contentStyles: BrandDetailsContentStyles = {
    container: {
        css: css` margin: 30px 15px; `,
    },
};

const styles = contentStyles;

const BrandDetailsContent: FC<Props> = () => {
    const { value: brand } = useContext(BrandStateContext);

    if (!brand || !brand.htmlContent) {
        return null;
    }

    return (
        <StyledWrapper {...styles.container} data-test-selector="brandContent">
            {parse(brand.htmlContent, parserOptions)}
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: BrandDetailsContent,
    definition: {
        group: "Brand Details",
        displayName: "Content",
        allowedContexts: [BrandDetailsPageContext],
    },
};

export default widgetModule;
