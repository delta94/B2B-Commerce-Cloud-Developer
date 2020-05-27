import React, { FC } from "react";
import styled, { css } from "styled-components";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Select, { SelectPresentationProps } from "@insite/mobius/Select";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect, ResolveThunks } from "react-redux";
import setLanguage from "@insite/client-framework/Store/Context/Handlers/SetLanguage";
import Globe from "@insite/mobius/Icons/Globe";
import Icon, { IconPresentationProps } from "@insite/mobius/Icon/Icon";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import translate from "@insite/client-framework/Translate";
import { getLanguages } from "@insite/client-framework/Store/Context/ContextSelectors";

const enum fields {
    showIcon = "showIcon",
}

const mapStateToProps = (state: ApplicationState) => ({
    languages: getLanguages(state),
    currentLanguage: state.context.session.language,
});

const mapDispatchToProps = {
    setLanguage,
};

export interface LanguageMenuStyles {
    languageWrapper?: InjectableCss;
    languageIcon?: IconPresentationProps;
    languageSelect?: SelectPresentationProps;
}

const styles: LanguageMenuStyles = {
    languageWrapper: {
        css: css`
            display: flex;
            align-items: center;
        `,
    },
    languageIcon: {
        size: 22,
        src: Globe,
        css: css` margin-top: 10px; `,
    },
    languageSelect: {
        backgroundColor: "common.accent",
        cssOverrides: {
            formInputWrapper: css` width: 100px; `,
            inputSelect: css`
                border: none;
                text-transform: uppercase;
            `,
        },
    },
};

interface OwnProps extends WidgetProps {
    fields: {
        [fields.showIcon]: boolean;
    };
}

export const LogoImage = styled.img` height: 22px; `;

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;
export const languageMenuStyles = styles;
const LanguageMenu: FC<Props> = ({ languages, currentLanguage, fields, setLanguage }) => {
    if (!languages || languages.length <= 1) {
        return null;
    }
    const menuId = "languageMenu";

    return (
        <StyledWrapper {...styles.languageWrapper}>
            {fields.showIcon && (currentLanguage?.imageFilePath
                ? <LogoImage src={currentLanguage.imageFilePath} alt="" />
                : <Icon {...styles.languageIcon} />)
            }
            <VisuallyHidden as="label" htmlFor={menuId} id={`${menuId}-label`}>
                {translate("Currency")}
            </VisuallyHidden>
            <Select
                {...styles.languageSelect}
                uid={menuId}
                data-test-selector="languageSelector"
                onChange={event => setLanguage({ languageId: event.currentTarget.value })}
                value={currentLanguage?.id}>
                {languages.map(c => (
                    <option value={c.id} key={c.id}>
                        {c.languageCode}
                    </option>
                ))}
            </Select>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(LanguageMenu),
    definition: {
        displayName: "Language Menu",
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