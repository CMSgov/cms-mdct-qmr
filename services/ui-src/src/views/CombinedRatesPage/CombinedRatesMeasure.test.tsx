import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { QueryClient, QueryClientProvider } from "react-query";
import { useApiMock } from "utils/testUtils/useApiMock";
import { RouterWrappedComp } from "utils/testing";
import { CombinedRatesMeasure } from "views";
expect.extend(toHaveNoViolations);

global.structuredClone = (val: any) => JSON.parse(JSON.stringify(val));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    year: "2024",
    state: "OH",
  }),
}));

const queryClient = new QueryClient();

beforeEach(() => {
  useApiMock({});
});
describe("Test CombinedRatesMeasure", () => {
  it("renders", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RouterWrappedComp>
          <CombinedRatesMeasure
            year={"2024"}
            measureId={"AAB-AD"}
            measureName={
              "Avoidance of Antibiotic Treatment for Acute Bronchitis/Bronchiolitis: Age 18 And Older"
            }
          />
        </RouterWrappedComp>
      </QueryClientProvider>
    );
    expect(
      screen.getByText("Measures used to calculate combined rates:")
    ).toBeVisible();
  });
});

describe("Test accessibility", () => {
  it("passes a11y tests", async () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <RouterWrappedComp>
          <CombinedRatesMeasure
            year={"2024"}
            measureId={"AAB-AD"}
            measureName={
              "Avoidance of Antibiotic Treatment for Acute Bronchitis/Bronchiolitis: Age 18 And Older"
            }
          />
        </RouterWrappedComp>
      </QueryClientProvider>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
