import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import Home from "../../pages";
import "@testing-library/jest-dom";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ info: {}, results: [] }),
  })
);

describe("Home Component", () => {
  it("renders search form and performs search", async () => {
    render(<Home data={{ info: {}, results: [] }} />);

    const searchInput = screen.getByTestId("searchId");
    const searchButton = screen.getByText("search");

    fireEvent.change(searchInput, { target: { value: "Rick" } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "https://rickandmortyapi.com/api/character/?name=Rick"
      );
    });
  });

  it("renders gender filter form and applies gender filter", async () => {
    render(<Home data={{ info: {}, results: [] }} />);

    const genderInput = screen.getByTestId("genderId");
    const genderButton = screen.getByText("gender");

    fireEvent.change(genderInput, { target: { value: "male" } });
    fireEvent.click(genderButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "https://rickandmortyapi.com/api/character/?gender=male"
      );
    });
  });

  it("check if page title is rendering", () => {
    const component = render(<Home data={{ info: {}, results: [] }} />);
    const titleText = component.getByText("My NextJS app");
    expect(titleText).toBeInTheDocument();
  });
});
