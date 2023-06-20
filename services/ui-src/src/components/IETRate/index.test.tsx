//history: this is just a copy of Rate.test.tsx
//there is currently an issue with checking rate at the category level instead of the qualifier level so we're using this one as a tempt for now

import { screen } from "@testing-library/react";
import fireEvent from "@testing-library/user-event";
import { IETRate } from ".";
import { renderWithHookForm } from "utils/testUtils/reactHookFormRenderer";
import userEvent from "@testing-library/user-event";

const TestComponent = () => {
  const rates = [
    {
      label: "test",
      denominator: "",
      numerator: "",
      rate: "",
      id: 1,
      uid: "test",
    },
  ];

  return <IETRate rates={rates} name="test-component" />;
};

const TestComponent2 = () => {
  const rates = [
    {
      label: "test",
      denominator: "",
      numerator: "",
      rate: "",
      id: 1,
      uid: "test",
    },
  ];

  return <IETRate rates={rates} name="test-component" readOnly={false} />;
};

const categories = [
  {
    label: "cat1: cat",
    text: "cat1: cat",
    id: "cat1-id",
  },
  {
    label: "cat1: Total",
    text: "cat1: Total",
    id: "cat1-total",
  },
];

const qualifiers = [
  {
    label: "qual1",
    text: "qual1",
    id: "qual1-id",
  },
  {
    label: "qual2",
    text: "qual2",
    id: "qual2-id",
  },
];

const TextComponentCategory = () => {
  let rates = qualifiers?.map((qual, idx) => ({
    label: qual.label,
    uid: categories[0].id + "." + qual.id,
    id: idx,
  }));

  return (
    <IETRate
      rates={rates}
      categories={categories}
      categoryName="cat1: cat"
      name="test-component"
      readOnly={false}
      calcTotal={true}
    />
  );
};

describe("Test the IETRate component", () => {
  beforeEach(() => {
    renderWithHookForm(<TestComponent />, {
      defaultValues: {
        "test-component": [
          {
            numerator: "1",
            denominator: "1",
            rate: "1",
          },
        ],
      },
    });
  });

  test("Check that component renders and includes a label when passed optionally", () => {
    expect(screen.getByText(/test/i)).toBeVisible();
  });

  test("Check that number input labels get rendered correctly", () => {
    expect(screen.getByLabelText(/denominator/i)).toBeVisible();
    expect(screen.getByLabelText(/numerator/i)).toBeVisible();
    expect(screen.getByLabelText(/rate/i)).toBeVisible();
  });

  test("Check that data pre-populates", () => {
    expect(screen.getAllByDisplayValue("1")).toHaveLength(3);
    expect(screen.getAllByDisplayValue("1")[0]).toBeInTheDocument();
  });

  test("Check that filling out text inputs changes rate calculation", async () => {
    const numeratorTextBox = await screen.findByLabelText("Numerator");
    const denominatorTextBox = await screen.findByLabelText("Denominator");
    const rateTextBox = await screen.findByLabelText("Rate");

    fireEvent.type(numeratorTextBox, "123");
    fireEvent.type(denominatorTextBox, "123");

    expect(rateTextBox).toHaveDisplayValue("100.0");
  });

  test("Check that the rate text box is readonly", async () => {
    const rateTextBox = await screen.findByLabelText("Rate");

    fireEvent.type(rateTextBox, "4321");

    expect(rateTextBox).toHaveDisplayValue("1");
  });
});

describe("Test rate component by category", () => {
  beforeEach(() => {
    let allRates: any = {};
    let defaultValues: any = { PerformanceMeasure: { rates: "" } };

    categories.forEach((cat) => {
      let rates: any[] = [];
      qualifiers.forEach((qual, index) => {
        let rate = {
          id: index,
          label: qual.label,
          denominator: "",
          numerator: "",
          rate: "",
          uid: cat.id + "." + qual.id,
          isTotal: cat.label.includes("Total"),
        };

        rates.push(rate);
      });

      defaultValues[cat.id] = rates;
      allRates[cat.id] = rates;
      defaultValues.PerformanceMeasure.rates = allRates;
    });

    renderWithHookForm(<TextComponentCategory />, {
      defaultValues: defaultValues,
    });
  });

  test("Check that calculateTotalCategory had run", () => {
    let numerator = screen.getAllByLabelText(/numerator/i)[0];
    fireEvent.type(numerator, "43");
    expect(numerator).toHaveValue("43");
  });
});

describe("Test non-readonly rate component", () => {
  test("Check that the rate can be typed in when not readonly", () => {
    renderWithHookForm(<TestComponent2 />, {
      defaultValues: {
        "test-component": [
          {
            numerator: "1",
            denominator: "1",
            rate: "1",
          },
        ],
      },
    });

    const rateTextBox = screen.getByLabelText("Rate");

    fireEvent.type(rateTextBox, "43");

    expect(rateTextBox).toHaveDisplayValue("43");
  });
});

const TestComponentWithTotal = () => {
  // Rates that include a total field
  const rates = [
    {
      label: "test1",
      denominator: "",
      numerator: "",
      rate: "",
      id: 1,
      uid: "test1",
    },
    {
      label: "test2",
      denominator: "",
      numerator: "",
      rate: "",
      id: 2,
      uid: "test2",
    },
    {
      label: "total",
      denominator: "",
      numerator: "",
      rate: "",
      id: 3,
      isTotal: true,
      uid: "Total",
    },
  ];

  return (
    <IETRate
      rates={rates}
      name="test-total-component"
      readOnly={false}
      calcTotal={true}
    />
  );
};

describe("Test the IETRate component when it includes a total NDR", () => {
  beforeEach(() => {
    renderWithHookForm(<TestComponentWithTotal />, {
      defaultValues: {
        "test-total-component": [
          {
            numerator: "1",
            denominator: "1",
            rate: "1",
          },
          {
            numerator: "2",
            denominator: "2",
            rate: "1",
          },
        ],
      },
    });
  });

  /* Iterate over all NDRs of rate component and confirm values match provided expectedValues. */
  const checkNDRs = (expectedValues: any) => {
    screen.getAllByLabelText(/numerator/i).forEach((numerator, index) => {
      expect(numerator).toHaveValue(expectedValues[index].numerator);
    });
    screen.getAllByLabelText(/denominator/i).forEach((numerator, index) => {
      expect(numerator).toHaveValue(expectedValues[index].denominator);
    });
    screen.getAllByLabelText(/rate/i).forEach((numerator, index) => {
      expect(numerator).toHaveValue(expectedValues[index].rate);
    });
  };

  test("Check that the components render and include their labels", () => {
    expect(screen.getByText(/test1/i)).toBeVisible();
    expect(screen.getByText(/test2/i)).toBeVisible();
    expect(screen.getByText(/total/i)).toBeVisible();
  });

  test("Check that the component renders with the correct default values", () => {
    const expectedValues = [
      {
        label: "test1",
        numerator: "1",
        denominator: "1",
        rate: "1",
      },
      {
        label: "test2",
        numerator: "2",
        denominator: "2",
        rate: "1",
      },
      {
        label: "total",
        numerator: "",
        denominator: "",
        rate: "",
      },
    ];

    checkNDRs(expectedValues);
  });

  test("Check that user input in a non-total field triggers total calculation", () => {
    // Change the test2 numerator from 2 to 1
    const numeratorToChange = screen.getAllByLabelText(/numerator/i)[1];
    userEvent.type(numeratorToChange, "1");

    const expectedValues = [
      {
        label: "test1",
        numerator: "1",
        denominator: "1",
        rate: "1",
      },
      {
        label: "test2",
        numerator: "1",
        denominator: "2",
        rate: "50.0",
      },
      {
        label: "total",
        numerator: "2",
        denominator: "3",
        rate: "66.7",
      },
    ];

    checkNDRs(expectedValues);

    // Change the test1 denominator from 1 to 5
    const denominatorToChange = screen.getAllByLabelText(/denominator/i)[0];
    userEvent.type(denominatorToChange, "5");

    expectedValues[0] = {
      label: "test1",
      numerator: "1",
      denominator: "5",
      rate: "20.0",
    };
    expectedValues[2] = {
      label: "total",
      numerator: "2",
      denominator: "7",
      rate: "28.6",
    };

    checkNDRs(expectedValues);
  });

  test("Check that if numerator > denominator, the calculated total rate should be empty", () => {
    // Change the numerator from 1 to 5
    const numeratorToChange = screen.getAllByLabelText(/numerator/i)[0];
    userEvent.type(numeratorToChange, "5");

    const expectedValues = [
      {
        label: "test1",
        numerator: "5",
        denominator: "1",
        rate: "",
      },
      {
        label: "test2",
        numerator: "2",
        denominator: "2",
        rate: "1",
      },
      {
        label: "total",
        numerator: "2",
        denominator: "2",
        rate: "100.0",
      },
    ];

    checkNDRs(expectedValues);
  });

  test("Check that user input in a total field does not trigger total calculation", () => {
    // Manually set the total numerator
    const numeratorToChange = screen.getAllByLabelText(/numerator/i)[2];
    userEvent.type(numeratorToChange, "5");

    const expectedValues = [
      {
        label: "test1",
        numerator: "1",
        denominator: "1",
        rate: "1",
      },
      {
        label: "test2",
        numerator: "2",
        denominator: "2",
        rate: "1",
      },
      {
        label: "total",
        numerator: "5",
        denominator: "",
        rate: "",
      },
    ];

    checkNDRs(expectedValues);

    // Manually set the total denominator
    const denominatorToChange = screen.getAllByLabelText(/denominator/i)[2];
    userEvent.type(denominatorToChange, "10");

    expectedValues[2] = {
      label: "total",
      numerator: "5",
      denominator: "10",
      rate: "50.0",
    };

    checkNDRs(expectedValues);
  });
});
