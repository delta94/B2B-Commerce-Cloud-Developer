import * as React from "react";
import MainHeader from "@insite/shell/Components/Shell/MainHeader";
import styled from "styled-components";
import { Route, Switch, withRouter, RouteComponentProps } from "react-router-dom";
import StyleGuideSideBar from "@insite/shell/Components/Shell/StyleGuide/StyleGuideEditor";
import { ShellThemeProps } from "@insite/shell/ShellTheme";
import ErrorModal from "@insite/shell/Components/Modals/ErrorModal";
import PageTreeSideBar from "@insite/shell/Components/PageTree/PageTreeSideBar";
import PageEditor from "@insite/shell/Components/PageEditor/PageEditor";
import StyleGuidePreview from "@insite/shell/Components/Shell/StyleGuide/StyleGuidePreview";
import MainNavigation from "@insite/shell/Components/Shell/MainNavigation";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import { connect } from "react-redux";
import ShellState from "@insite/shell/Store/ShellState";
import { emptyGuid } from "@insite/client-framework/Common/StringHelpers";
import { useEffect } from "react";
import LogoutWarningModal from "@insite/shell/Components/Modals/LogoutWarningModal";
import About from "@insite/shell/Components/Shell/About";

const homePageLoader = (props: ReturnType<typeof mapStateToProps> & RouteComponentProps) => {
    useEffect(() => {
        if (props.homePageId !== emptyGuid) {
            props.history.push(`/ContentAdmin/Page/${props.homePageId}`);
        }
    });

    return null;
};

const mapStateToProps = (state: ShellState) => ({
    homePageId: state.shellContext.homePageId,
});

const HomePageLoader = connect(mapStateToProps)(withRouter(homePageLoader));

const FlexWrapper = styled.div`
    display: flex;
    height: 100%;
    background-color: ${(props: ShellThemeProps) => props.theme.colors.common.background};
`;

const SideBarArea = styled.div`
    width: ${(props: ShellThemeProps) => props.theme.sideBarWidth};
    overflow: hidden;
    position: relative;
`;

const MainArea = styled.div`
    width: calc(100% - ${(props: ShellThemeProps) => props.theme.sideBarWidth});
`;

const layout = <FlexWrapper>
    <SideBarArea>
        <MainNavigation />
        <Switch>
            <Route exact path="/ContentAdmin/Design/StyleGuide" component={StyleGuideSideBar} />
            <Route path="/ContentAdmin/Page/" component={PageTreeSideBar} />
        </Switch>
    </SideBarArea>
    <MainArea>
        <Switch>
            <Route path="/ContentAdmin/Page/*" render={(props) => <MainHeader {...props} />} />
            <Route path={["/ContentAdmin/Design", "/ContentAdmin/", "/ContentAdmin/About"]}><MainHeader disabled/></Route>
            <MainHeader/>
        </Switch>
        <Switch>
            <Route exact path="/ContentAdmin/Page/:id" component={PageEditor} />
            <Route exact path="/ContentAdmin/Design/StyleGuide" component={StyleGuidePreview} />
            <Route exact path="/ContentAdmin/About" component={About} />
            <Route component={HomePageLoader} />
        </Switch>
    </MainArea>
    <LogoutWarningModal />
    <ErrorModal />
</FlexWrapper>;

export default layout;

export const SideBarStyle = styled.div<InjectableCss>`
    width: ${(props: ShellThemeProps) => props.theme.sideBarWidth};
    height: calc(100vh - 55px);
    padding: 14px 35px 35px;
    overflow: auto;
    ${injectCss}
`;