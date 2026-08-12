import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

export function PageHeader({ title, description, children }) {
  return _jsxs("div", {
    className: "mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between",
    children: [
      _jsxs("div", {
        className: "space-y-1.5",
        children: [
          _jsx("h1", {
            className: "text-[28px] font-extrabold tracking-tight text-[#000000] lg:text-[32px]",
            children: title,
          }),
          description &&
            _jsx("p", {
              className: "text-[15px] font-medium text-[#5A5A5A]",
              children: description,
            }),
        ],
      }),
      children &&
        _jsx("div", {
          className: "flex items-center gap-3",
          children,
        }),
    ],
  });
}
