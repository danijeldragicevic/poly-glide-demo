import poly from "polyapi";

(async () => {
    const response = await poly.demo.getCityName(40.7128, -74.0060);
    console.log(response);
})();