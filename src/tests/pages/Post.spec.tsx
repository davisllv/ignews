import { render, screen } from "@testing-library/react";
import { stripe } from "../../services/stripe";
import Post, { getServerSideProps } from "../../pages/posts/[slug]";
import { mocked } from "ts-jest/utils";
import { getPrismicClient } from "../../services/prismic";
import { getSession } from "next-auth/client";

const post = {
  slug: "my-new-post",
  title: "My new Post",
  content: "<p>Post example </p>",
  updatedAt: "10 de abril",
};
jest.mock("next-auth/client");
jest.mock("../../services/prismic");

describe("Home page", () => {
  it("render correctly", () => {
    render(<Post post={post} />);

    expect(screen.getByText("My new Post")).toBeInTheDocument();
    expect(screen.getByText("Post example")).toBeInTheDocument();
  });

  it("redirects user", async () => {
    const getSessionMocked = mocked(getSession);
    getSessionMocked.mockResolvedValueOnce(null);

    const response = await getServerSideProps({
      params: { slug: "my-new-post" },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: "/",
        }),
      })
    );
  });

  it("loads initial data", async () => {
    const getSessionMocked = mocked(getSession);
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: "heading", text: "My new Post" }],
          content: [{ type: "paragraph", text: "Post example" }],
        },
        last_publication_date: "04-01-2021",
      }),
    } as any);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: "fake-active-subscription",
    } as any);

    const response = await getServerSideProps({
      params: { slug: "my-new-post" },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: "my-new-post",
            title: "My new Post",
            content: "<p>Post example</p>",
            updatedAt: "01 de abril de 2021",
          },
        },
      })
    );
  });
});
