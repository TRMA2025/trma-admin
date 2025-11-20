import { Chip } from "@mui/material";

const FilterChips = (data) => {
  console.log(data, "from chips");

  return (
    <div className="row">
      <div className="col-lg-12 col-sm-12">
        <b className="me-3 pt-1 ms-2 color-data-grid">Filtered By:</b>
        {data.filterToShow.length > 0
          ? data.filterToShow.map((item, index) => {
              return (
                <span>
                  {item.text && (
                    <Chip
                      label={item.text}
                      className="mb-2 mt-1 me-1"
                      onDelete={() => data.handleRemove(item.key)}
                      // onClick={handleClickChip()}
                      sx={{
                        color: "white",
                      }}
                    />
                  )}
                </span>
              );
            })
          : ""}
      </div>
    </div>
  );
};

export default FilterChips;
