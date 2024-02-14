/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { SearchContainer } from "./styled";
import {
  BasicDateTimePicker,
  CustomButton,
  Journey,
  LocationDropdown,
} from "../../components/index";
import { useJourneySearchQuery } from "../../hooks/useJourney";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import AlertSpan from "../alert_span";
import { ISearchFormValues } from "../../interfaces";
import { initialSearchValues } from "../../constants";

const validationSchema = Yup.object().shape({
  locationIdFrom: Yup.string().required("coming from..."),
  locationIdTo: Yup.string().required("heading to..."),
  dateTimeFrom: Yup.string().required("date from required..."),
  dateTimeTo: Yup.string().required("date to required..."),
});

export default function Search() {
  const [selectedLeaving, setSelectedLeaving] = useState("");
  const [selectedGoing, setSelectedGoing] = useState("");
  const [journeys, setJourneys] = useState<any[]>();
  const [showResults, setShowResults] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [searchParams, setSearchParams] = useState(initialSearchValues);

  const handleFormSubmit = (values: ISearchFormValues) => {
    setSearchParams((prevSearchParams) => ({
      ...prevSearchParams,
      locationIdFrom: values.locationIdFrom,
      dateTimeFrom: values.dateTimeFrom,
      dateTimeTo: values.dateTimeTo,
      locationIdTo: values.locationIdTo,
    }));
  };

  const mutateSearchJourneys = useMutation({
    mutationFn: useJourneySearchQuery,
    onSuccess: (data) => {
      setShowAlert(false);
      setJourneys(data);
      setShowResults(true);
    },
    onError: () => {
      setShowResults(false);
      setShowAlert(true);
    },
  });

  const resultState = (state: boolean) => {
    setShowResults(state);
    setJourneys(undefined);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };
  const formik = useFormik({
    initialValues: initialSearchValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleFormSubmit(values);
    },
  });

  useEffect(() => {
    if (searchParams.locationIdTo) {
      mutateSearchJourneys.mutate(searchParams);
    }
  }, [searchParams]);

  return (
    <Box component="form" noValidate onSubmit={formik.handleSubmit}>
      <SearchContainer>
        <LocationDropdown
          id="leaving-from-dropdown"
          label="Leaving From"
          name="locationIdFrom"
          selectedLocation={selectedLeaving}
          setSelectedLocation={setSelectedLeaving}
          onChange={formik.setFieldValue}
          value={formik.values.locationIdFrom}
          formikErrors={formik.errors.locationIdFrom}
          formikTouched={formik.touched.locationIdFrom}
        />
        <LocationDropdown
          id="going-to-dropdown"
          label="Going to"
          name="locationIdTo"
          selectedLocation={selectedGoing}
          setSelectedLocation={setSelectedGoing}
          value={formik.values.locationIdTo}
          onChange={formik.setFieldValue}
          formikErrors={formik.errors.locationIdTo}
          formikTouched={formik.touched.locationIdTo}
        />

        <BasicDateTimePicker
          name="dateTimeFrom"
          value={formik.values.dateTimeFrom}
          onChange={formik.setFieldValue}
          label="Earliest Date/Time"
          formikErrors={formik.errors.dateTimeFrom}
          formikTouched={formik.touched.dateTimeFrom}
        />
        <BasicDateTimePicker
          name="dateTimeTo"
          value={formik.values.dateTimeTo}
          label="Latest Date/Time"
          onChange={formik.setFieldValue}
          formikErrors={formik.errors.dateTimeTo}
          formikTouched={formik.touched.dateTimeTo}
        />
        <CustomButton type="submit" label="Search" />
      </SearchContainer>
      {showResults && journeys && journeys[0] && (
        <Journey
          results={journeys}
          departure={journeys[0].locationFrom.description}
          destination={journeys[0].locationTo.description}
          state={resultState}
        />
      )}
      {showAlert && (
        <AlertSpan
          severity="warning"
          variant="filled"
          title="Oh no!"
          text="No rides for selected locations or dates. "
          state={handleCloseAlert}
        />
      )}
    </Box>
  );
}
