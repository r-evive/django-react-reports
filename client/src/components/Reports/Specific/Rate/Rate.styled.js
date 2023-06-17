import { Button } from "react-bootstrap";
import { styled } from "styled-components";

export const RateButton = styled(Button)`

`

export const RateIcon = styled.i.attrs(props => ({
    className: `bi bi-star-fill`
    }))`

    margin-right: 10px;
`;