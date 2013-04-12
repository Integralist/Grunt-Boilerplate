/*
 * *print_ratio.generated.c
 * Generated from optim.c
 *
 * Copyright (C) 2008-2012 Cosmin Truta.
 *
 * This software is distributed under the zlib license.
 * Please see the attached LICENSE for more information.
 */

#include "print_ratio.h"
#include <stdio.h>
#include "../osys.h"

#ifdef _MSC_VER
#define snprintf _snprintf
#endif

int
sprint_fsize_ratio(char *buf, size_t bufsize, osys_fsize_t num, osys_fsize_t denom, int force_percent)
{
    /* (1) num/denom = 0/0                  ==> print "??%"
     * (2) num/denom = INFINITY             ==> print "INFTY%"
     * (3) 0 <= num/denom < 99.995%         ==> use the percent format "99.99%"
     *     if force_percent:
     * (4)    0.995 <= num/denom < INFINITY ==> use the percent format "999%"
     *     else:
     * (5)    0.995 <= num/denom < 99.995   ==> use the factor format "9.99x"
     * (6)    99.5 <= num/denom < INFINITY  ==> use the factor format "999x"
     *     end if
     */

    osys_fsize_t integer_part, remainder;
    unsigned int fractional_part, scale;
    double scaled_ratio;

    /* (1,2): num/denom = 0/0 or num/denom = INFINITY */
    if (denom == 0)
    {
        return snprintf(buf, bufsize, num == 0 ? "??%%" : "INFTY%%");
    }

    /* (3): 0 <= num/denom < 99.995% */
    /* num/denom < 99.995% <==> denom/(denom-num) < 20000 */
    if (num < denom && denom / (denom - num) < 20000)
    {
        scale = 10000;
        scaled_ratio = ((double)num * (double)scale) / (double)denom;
        fractional_part = (unsigned int)(scaled_ratio + 0.5);
        /* Adjust the scaled result in the event of a roundoff error. */
        /* Such error may occur only if the numerator is extremely large. */
        if (fractional_part >= scale)
            fractional_part = scale - 1;
        return snprintf(buf, bufsize, "%u.%02u%%", fractional_part / 100, fractional_part % 100);
    }

    /* Extract the integer part out of the fraction for the remaining cases. */
    integer_part = num / denom;
    remainder = num % denom;
    scale = 100;
    scaled_ratio = ((double)remainder * (double)scale) / (double)denom;
    fractional_part = (unsigned int)(scaled_ratio + 0.5);
    if (fractional_part >= scale)
    {
        fractional_part = 0;
        ++integer_part;
    }

    /* (4): 0.995 <= num/denom < INFINITY */
    if (force_percent)
    {
        return snprintf(buf, bufsize, "%" OSYS_FSIZE_PRIu "%02u%%",
                   integer_part, fractional_part);
    }

    /* (5): 0.995 <= num/denom < 99.995 */
    if (integer_part < 100)
    {
        return snprintf(buf, bufsize, "%" OSYS_FSIZE_PRIu ".%02ux",
                   integer_part, fractional_part);
    }

    /* (6): 99.5 <= num/denom < INFINITY */
    /* Round to the nearest integer. */
    /* Recalculate the integer part, for corner cases like 123.999. */
    integer_part = num / denom;
    if (remainder > (denom - 1) / 2)
        ++integer_part;
    return snprintf(buf, bufsize, "%" OSYS_FSIZE_PRIu "x", integer_part);
}
