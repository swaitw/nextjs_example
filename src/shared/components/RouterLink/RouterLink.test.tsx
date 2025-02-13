import { render, screen } from "@testing-library/react";
import RouterLink from "../RouterLink";

describe("RouterLink Component", () => {
  test("renders the children correctly", () => {
    render(<RouterLink href="/test">Click Here</RouterLink>);

    const linkElement = screen.getByText("Click Here");
    expect(linkElement).toBeInTheDocument();
  });

  test("renders the correct href", () => {
    render(<RouterLink href="/test">Click Here</RouterLink>);

    const linkElement = screen.getByRole("link", { name: /click here/i });
    expect(linkElement).toHaveAttribute("href", "/test");
  });
});
