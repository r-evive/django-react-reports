import { styled } from "styled-components";
import { Colors } from "../../../Colors";

export const GoBackLink = styled.span`
    display: block;
    width: 100%;
    cursor: pointer;
    color: ${Colors.primary};
    font-weight: 400;
    margin-bottom: 20px;
    &:hover {
        text-decoration: underline;
    }
`

export const Arrow = styled.i.attrs(props => ({
    className: `bi bi-arrow-${props.direction}`
    }))`
    color: ${Colors.primary};
    margin-right: 10px;
`;