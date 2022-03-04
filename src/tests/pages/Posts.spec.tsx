import { render, screen } from "@testing-library/react";
import { stripe } from "../../services/stripe";
import Posts, { getStaticProps } from "../../pages/posts";
import { mocked } from "ts-jest/utils";
import { getPrismicClient } from "../../services/prismic";

const posts = [
  {
    slug: "my-new-post",
    title: "My new Post",
    excerpt: "Post example",
    updatedAt: "10 de abril",
  },
];

jest.mock("../../services/prismic");

describe("Home page", () => {
  it("render correctly", () => {
    render(<Posts posts={posts} />);

    expect(screen.getByText("My new Post")).toBeInTheDocument();
  });

  it("loads initial data", async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);
    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: "my-new-post",
            data: {
              title: [{ type: "heading", text: "My new" }],
              content: [{ type: "heading", text: "Post excerpt" }],
            },
            last_publication_date: "04-01-2021",
          },
        ],
      }),
    } as any);

    const response = await getStaticProps({});
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              excerpt: "",
              slug: "my-new-post",
              title: "My new",
              updatedAt: "01 de abril de 2021",
            },
          ],
        },
      })
    );
  });
});
