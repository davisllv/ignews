import { fireEvent, render, screen } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import { signIn } from "next-auth/client";
import { SubscribeButton } from ".";
import { useRouter } from "next/router";

jest.mock("next-auth/client", () => {
  return {
    useSession() {
      return [null, false];
    },
    signIn: jest.fn(),
  };
});

jest.mock("next/router", () => {
  return {
    useRouter() {
      return {
        push: jest.fn(),
      };
    },
  };
});

describe("SignInButton component", () => {
  it("renders correctly ", () => {
    render(<SubscribeButton />);

    expect(screen.getByText("Subscribe now")).toBeInTheDocument();
  });

  it("redirects user to sign in when not authenticated", () => {
    const signInMocked = mocked(signIn);
    render(<SubscribeButton />);

    const subscribeButton = screen.getByText("Subscribe now");

    fireEvent.click(subscribeButton);

    expect(signInMocked).toBeCalled();
  });

  it("redirects to posts when user already has a authenticated", () => {
    const useRouterMocked = mocked(useRouter);
    useRouterMocked.mockReturnValueOnce;
    render(<SubscribeButton />);

    const subscribeButton = screen.getByText("Subscribe now");

    fireEvent.click(subscribeButton);

    expect(pushMocked).toHaveBeenCalled();
  });
});
