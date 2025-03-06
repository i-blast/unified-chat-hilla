import {createMenuItems} from '@vaadin/hilla-file-router/runtime.js';
import {AppLayout, DrawerToggle, Icon, SideNav, SideNavItem, Tooltip} from '@vaadin/react-components';
import {Suspense} from 'react';
import {Outlet, useLocation, useNavigate} from 'react-router';
import {effect, signal} from "@vaadin/hilla-react-signals";

export const pageTitle = signal<string>("")
effect(() => {
    document.title = pageTitle.value
})

export default function MainLayout() {
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <AppLayout primarySection="drawer">
            <div slot="drawer" className="flex flex-col justify-between h-full p-m">
                <header className="flex flex-col gap-m">
                    <span className="text-l font-semibold" slot="drawer">Vaadin Chat</span>
                    <SideNav onNavigate={({path}) => navigate(path!)} location={location}>
                        {createMenuItems().map(({to, title, icon}) => (
                            <SideNavItem path={to} key={to}>
                                {icon ? <Icon src={icon} slot="prefix"></Icon> : <></>}
                                {title}
                            </SideNavItem>

                        ))}
                    </SideNav>
                </header>
            </div>
            <DrawerToggle aria-label="Menu toggle" slot="navbar">
                <Tooltip slot="tooltip" text="Menu toggle"/>
            </DrawerToggle>
            <h2 className="text-l m-0 flex-grow" slot="navbar">{pageTitle.value}</h2>
            <Suspense fallback={<div>Loading....</div>}>
                <Outlet/>
            </Suspense>
        </AppLayout>
    )
}