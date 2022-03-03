import { render } from "@testing-library/react";
import { ActiveLink } from ".";

jest.mock("next/router", () => {
  return {
    useRouter() {
      return {
        asPath: "/",
      };
    },
  };
});

describe("ActiveLink component", () => {
  test("active link renders correctly", () => {
    const { getByText } = render(
      <ActiveLink href={"/"} activeClassName="active">
        <p>Home</p>
      </ActiveLink>
    );

    expect(getByText("Home")).toBeInTheDocument();
  });

  test("active link is receiving the active class", () => {
    const { getByText } = render(
      <ActiveLink href={"/"} activeClassName="active">
        <p>Home</p>
      </ActiveLink>
    );

    expect(getByText("Home")).toHaveClass("class");
  });
});
