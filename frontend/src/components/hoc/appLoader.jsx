import PropTypes from "prop-types";

const AppLoader = ({ children }) => {
  // const dispatch = useDispatch();
  // useEffect(() => {}, []);
  return children;
};

AppLoader.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default AppLoader;
