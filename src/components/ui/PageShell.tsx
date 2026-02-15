import React from "react";

type Props = {
    title?: string;
    subtitle?: string;
    actions?: React.ReactNode;
    children: React.ReactNode;
};

export default function PageShell({ title, subtitle, actions, children }: Props) {
    return (
        <div style={{ padding: 20 }}>
            {(title || subtitle || actions) && (
                <header style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 16
                }}>
                    <div>
                        {title && <h1 style={{ margin: 0, fontSize: 20 }}>{title}</h1>}
                        {subtitle && <p style={{ margin: "6px 0 0 0", color: "#666" }}>{subtitle}</p>}
                    </div>
                    {actions && <div>{actions}</div>}
                </header>
            )}
            <section>
                {children}
            </section>
        </div>
    );
}