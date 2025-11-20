import PropTypes from 'prop-types';
// material
import { Grid } from '@mui/material';
import ProgrammesCard from './ProgrammesCard';
import ProgrammeMainCard from './ProgrammeMainCard';

// ----------------------------------------------------------------------

ProgrammesList.propTypes = {
  products: PropTypes.array.isRequired
};

export default function ProgrammesList({ products, ...other }) {
  return (
    <div className="row">
      {/* <div className="col-lg-12 col-md-12 col-sm-12 mb-3">
        <ProgrammeMainCard product={products} />
      </div> */}
      {products.map((product) => (
        <div className="col-lg-4 col-md-6 col-sm-12 mt-4">
          <ProgrammesCard product={product} />
        </div>
      ))}
    </div>
  );
}
