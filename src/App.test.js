import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test("renders learn react link", () => {
  render(<App />);
  // const linkElement = screen.getByText(/learn react/i);
  const linkElement = screen.getByRole("link");
  expect(linkElement).toBeInTheDocument();
  expect(linkElement).toHaveTextContent(/learn react/i);
});

test("renders code app", () => {
  render(<App />);
  const codeAppElement = screen.getByTestId("code-app");
  expect(codeAppElement).toBeInTheDocument();
  expect(codeAppElement).toHaveTextContent("src/App.js");
});

test("check counter on click me button", () => {
  render(<App />);
  const button = screen.getByRole("button");
  const counter = screen.getByTestId("count");
  expect(button).toBeInTheDocument();
  expect(counter).toBeInTheDocument();
  expect(counter).toHaveTextContent("0");
  fireEvent.click(button);
  expect(counter).toHaveTextContent("1");
});
