/*
 * print_ratio_test.c
 * Test for print_fsize_ratio.
 *
 * Copyright (C) 2008-2012 Cosmin Truta.
 *
 * This software is distributed under the zlib license.
 * Please see the attached LICENSE for more information.
 */

#include "print_ratio.h"
#include <stdio.h>
#include <string.h>

static int num_errors = 0;

static int
test(unsigned long num, unsigned long denom,
     const char *expected_result,
     const char *expected_result_force_percent)
{
    char buf1[64], buf2[64];
    int result = 1;

    sprint_fsize_ratio(buf1, sizeof(buf1), num, denom, 0);
    if (strcmp(buf1, expected_result) != 0)
        result = 0;

    sprint_fsize_ratio(buf2, sizeof(buf2), num, denom, 1);
    if (strcmp(buf2, expected_result_force_percent) != 0)
        result = 0;

    if (result)
        printf("Passed: %lu / %lu\n", num, denom);
    else
        printf("FAILED: %lu / %lu, result: (%s %s), expected: (%s %s)\n",
               num, denom,
               buf1, buf2,
               expected_result, expected_result_force_percent);

    if (!result)
        ++num_errors;
    return result;
}

static void
run_tests()
{
    const unsigned long MAX = ~0UL;

    /*
     * (1) num/denom == 0/0
     */
    test(0, 0, "??%", "??%");

    /*
     * (2) num/denom == INFINITY
     */
    test(1, 0, "INFTY%", "INFTY%");

    /*
     * (3) 0 <= num/denom < 99.995% ==> precision = 0.0001
     */
    test(     0,      1,  "0.00%",  "0.00%");  /* = 0% */
    test(     0,    MAX,  "0.00%",  "0.00%");  /* = 0% */
    test(     1,    MAX,  "0.00%",  "0.00%");  /* > 0% */
    test(     1,  20001,  "0.00%",  "0.00%");  /* < 0.005% */
    test(     1,  20000,  "0.01%",  "0.01%");  /* = 0.005% */
    test(     1,  19999,  "0.01%",  "0.01%");  /* > 0.005% */
    test(     1,  10000,  "0.01%",  "0.01%");  /* = 0.01% */
    test(     1,   4001,  "0.02%",  "0.02%");  /* < 0.025% */
    test(     1,   4000,  "0.03%",  "0.03%");  /* = 0.025% */
    test(     1,   3999,  "0.03%",  "0.03%");  /* > 0.025% */
    test(199000, 995000, "20.00%", "20.00%");  /* = 20% */
    test( MAX/5,    MAX, "20.00%", "20.00%");  /* = 20% */
    test( MAX/9,  MAX/3, "33.33%", "33.33%");  /* < 33.33...% */
    test(    49,     99, "49.49%", "49.49%");  /* = 49.4949...% */
    test(494949, 999999, "49.49%", "49.49%");  /* = 49.4949...% */
    test( MAX/2,    MAX, "50.00%", "50.00%");  /* < 50% */
    test( MAX/2,  MAX-1, "50.00%", "50.00%");  /* = 50% */
    test( 50005, 100000, "50.01%", "50.01%");  /* = 50.005% */
    test(    50,     99, "50.51%", "50.51%");  /* = 50.5050...% */
    test(505050, 999999, "50.51%", "50.51%");  /* = 50.5050...% */
    test( 99995, 100001, "99.99%", "99.99%");  /* < 99.95% */

    /*
     * (4) 0.995 <= num/denom < INFINITY and force_percent
     * (5) 0.995 <= num/denom < 99.995 ==> precision = 0.01
     */
    test( 99995, 100000,  "1.00x",   "100%");  /* = 99.95% */
    test( MAX-1,    MAX,  "1.00x",   "100%");  /* < 1.0 */
    test(     1,      1,  "1.00x",   "100%");  /* = 1.0 */
    test(   MAX,    MAX,  "1.00x",   "100%");  /* = 1.0 */
    test(   MAX,  MAX-1,  "1.00x",   "100%");  /* > 1.0 */
    test( 12350,  10001,  "1.23x",   "123%");  /* < 1.235 */
    test( 12350,  10000,  "1.24x",   "124%");  /* = 1.235 */
    test( MAX,  MAX/2+1,  "2.00x",   "200%");  /* < 2.0 */
    test( MAX-1,  MAX/2,  "2.00x",   "200%");  /* = 2.0 */
    test(   MAX,  MAX/2,  "2.00x",   "200%");  /* > 2.0 */
    test(   MAX,  MAX/6,  "6.00x",   "600%");  /* > 6.0 */
    test(   MAX,  MAX/9,  "9.00x",   "900%");  /* > 9.0 */
    test(  1299,    100, "12.99x",  "1299%");  /* = 12.99 */
    test( 12999,   1000, "13.00x",  "1300%");  /* = 12.999 */
    test(   MAX, MAX/99, "99.00x",  "9900%");  /* > 99.0 */
    test(999950,  10001, "99.99x",  "9999%");  /* < 99.995 */
    test(999949,  10000, "99.99x",  "9999%");  /* < 99.995 */

    /*
     * (4) 0.995 <= num/denom < INFINITY and force_percent
     * (6) 99.5 <= num/denom < INFINITY ==> precision = 1.0
     */
    test(999950,  10000,   "100x", "10000%");  /* = 99.995 */
    test(   502,      5,   "100x", "10040%");  /* < 100.5 */
    test(  1004,     10,   "100x", "10040%");  /* < 100.5 */
    test(  1005,     10,   "101x", "10050%");  /* = 100.5 */
    test(   503,      5,   "101x", "10060%");  /* > 100.5 */
    test(  1006,     10,   "101x", "10060%");  /* > 100.5 */
    test( 12399,    100,   "124x", "12399%");  /* = 123.99 */
    test(123999,   1000,   "124x", "12400%");  /* = 123.999 */
    test(MAX,   MAX/999,   "999x", "99900%");  /* > 999.0 */
    test(999499,   1000,   "999x", "99950%");  /* < 999.5 */
    test(999500,   1000,  "1000x", "99950%");  /* = 999.5 */
}

int
main()
{
    run_tests();
    if (num_errors != 0)
    {
        printf("** %d tests FAILED.\n", num_errors);
        return 1;
    }
    else
    {
        printf("** All tests passed.\n");
        return 0;
    }
}
