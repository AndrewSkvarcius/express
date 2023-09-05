const express = require('express')
const app = express()
const ExpressErr = require('./expressError')

const { convertAndValidateNumsArray, findMode, findMean, findMedian } = require('./helpers');

app.get('/mean', (req,res, nekst) => {
    if (!req.query.nums){
        throw new ExpressErr('Must pass a query key of nums with comma-seperated list of numbers', 400)

    }
    let numsAsString = req.query.nums.split(',');

    let nums = convertAndValidateNumsArray(numsAsString);
    if (nums instanceof Error )
    {
    throw new ExpressErr(nums.message);
    }
let result = {
    operation: "mean",
    result: findMean(nums)
}
return res.send(result)
});

app.get('/median', (req,res, nekst) => {
    if (!req.query.nums){
        throw new ExpressErr('Must pass a query key of nums with comma-seperated list of numbers', 400)

    }
    let numsAsString = req.query.nums.split(',');

    let nums = convertAndValidateNumsArray(numsAsString);
    if (nums instanceof Error )
{
    throw new ExpressErr(nums.message);
}
let result = {
    operation: "median",
    result: findMedian(nums)
}
return res.send(result)
});

app.get('/mode', (req,res, nekst) => {
    if (!req.query.nums){
        throw new ExpressErr('Must pass a query key of nums with comma-seperated list of numbers', 400)

    }
    let numsAsString = req.query.nums.split(',');

    let nums = convertAndValidateNumsArray(numsAsString);
    if (nums instanceof Error )
{
    throw new ExpressErr(nums.message);
}
let result = {
    operation: "mode",
    result: findMode(nums)
}
return res.send(result)
});

// error handling 
app.use(function(req,res, nekst){
    const err = new ExpressErr("Invalid",404);

    // pass eroor to next piece of middleware
    return nekst(err)
})
// error handling
app.use(function(err, req, res, nekst){
    res.status(err.status || 500);

    return res.json({
        error: err,
        message: err.message
    });
});

app.listen(3000, function() {
    console.log(`Server starting on port 3000`);
  });
  