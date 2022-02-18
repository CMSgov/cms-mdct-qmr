import { render, screen } from "@testing-library/react";
import { RouterWrappedComp } from "utils/testing";
import { AutocompletedMeasureTemplate } from ".";

beforeEach(() => {
  render(
    <RouterWrappedComp>
      <AutocompletedMeasureTemplate
        measureTitle="Test title"
        performanceMeasureText="test measure test"
        year="2021"
      />
    </RouterWrappedComp>
  );
});

describe("Test AutocompletedMeasureTemplate.tsx", () => {
  it("renders component properly with correct test text", () => {
    expect(screen.getByText(/test title/i)).toBeInTheDocument();

    expect(screen.getByText(/test measure test/i)).toBeInTheDocument();

    expect(
      screen.getByText(
        /States are not asked to report data for this measure for FFY 2021 Core Set/i
      )
    ).toBeInTheDocument();

    expect(screen.getByText(/Print/i)).toBeInTheDocument();

    expect(screen.getByText(/Back to Core Set Measures/i)).toBeInTheDocument();
  });
});
