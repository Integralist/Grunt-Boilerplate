/*
 * cbitset_test.c
 * Test driver for cbitset.
 *
 * Copyright (C) 2001-2010 Cosmin Truta.
 *
 * This software is distributed under the zlib license.
 * Please see the attached LICENSE for more information.
 */


#include "cbitset.h"

#include <assert.h>
#include <ctype.h>
#include <errno.h>
#include <stdio.h>
#include <string.h>


char *my_strrtrim(char *str)
{
    char *ptr;
    char *end;

    end = str;
    for (ptr = str; *ptr != 0; ++ptr)
    {
        if (!isspace(*ptr))
            end = ptr + 1;
    }
    *end = (char)0;
    return str;
}


void check_bitset(bitset_t value)
{
    char buf[BITSIZEOF(value) + 1];
    bitset_t empty, full;
    bitset_t flipped1, flipped2, flipped3, flipped4;
    int i;

    bitset_to_string(buf, sizeof(buf), value);
    printf("checking: %s\n", buf);

    empty = full = flipped1 = value;
    bitset_reset_range(&empty, BITSET_ELT_MIN, BITSET_ELT_MAX);
    bitset_set_range(&full, BITSET_ELT_MIN, BITSET_ELT_MAX);
    bitset_flip_range(&flipped1, BITSET_ELT_MIN, BITSET_ELT_MAX);
    assert(empty == BITSET_EMPTY);
    assert(full == BITSET_FULL);
    assert(flipped1 == ~value);

    flipped4 = flipped3 = flipped2 = flipped1;
    for (i = BITSET_ELT_MIN; i <= BITSET_ELT_MAX; ++i)
    {
        bitset_flip(&flipped1, i);
        bitset_flip_range(&flipped2, i, i);
        if (bitset_test(flipped3, i))
        {
            bitset_reset(&flipped3, i);
            bitset_reset_range(&flipped4, i, i);
        }
        else
        {
            bitset_set(&flipped3, i);
            bitset_set_range(&flipped4, i, i);
        }
        assert(flipped1 == flipped2);
        assert(flipped2 == flipped3);
        assert(flipped3 == flipped4);
    }
    assert(flipped1 == value);
}


void dump_bitset(bitset_t value)
{
    unsigned int forward_count, reverse_count;
    int i;

    printf("count: %u\n", bitset_count(value));
    printf("iteration:");
    forward_count = 0;
    for (i = bitset_find_first(value); i >= 0; i = bitset_find_next(value, i))
    {
        ++forward_count;
        printf(" %d", i);
        assert(i >= BITSET_ELT_MIN && i <= BITSET_ELT_MAX);
        assert(bitset_test(value, i));
    }
    printf("\nreverse iteration:");
    reverse_count = 0;
    for (i = bitset_find_last(value); i >= 0; i = bitset_find_prev(value, i))
    {
        ++reverse_count;
        printf(" %d", i);
        assert(i >= BITSET_ELT_MIN && i <= BITSET_ELT_MAX);
        assert(bitset_test(value, i));
    }
    printf("\n");
    assert(bitset_count(value) == forward_count);
    assert(forward_count == reverse_count);
}


void dump_error(int err)
{
    if (err == EINVAL)
        printf("error: EINVAL\n");
    else if (err == ERANGE)
        printf("error: ERANGE\n");
    else if (err != 0)
        printf("error: errno == %d\n", err);
}


int main()
{
    char buf[256];
    char *ptr;
    size_t end_idx;
    bitset_t set;
    int saved_errno;

    for ( ; ; )
    {
        /* Input text */
        if (fgets(buf, sizeof(buf), stdin) == NULL)
            return 0;
        my_strrtrim(buf);

        if (buf[0] == 0 || buf[0] == '#')
        {
            /* Skip empty and #comment lines. */
            continue;
        }

        printf("%s\n", buf);

        if (strncmp(buf, "bin:", 4) == 0)
        {
            /* Test string_to_bitset() */
            ptr = buf + 4;
            errno = 0;
            set = string_to_bitset(ptr, &end_idx);
            saved_errno = errno;
            if (ptr[end_idx] != 0)
                printf("...%s\n", &ptr[end_idx]);
            check_bitset(set);
            dump_bitset(set);
            dump_error(saved_errno);
            printf("\n");
            continue;
        }

        if (strncmp(buf, "range:", 6) == 0)
        {
            /* Test rangeset_string_to_bitset() */
            ptr = buf + 6;
            errno = 0;
            set = rangeset_string_to_bitset(ptr, &end_idx);
            saved_errno = errno;
            if (ptr[end_idx] != 0)
                printf("...%s\n", &ptr[end_idx]);
            check_bitset(set);
            dump_bitset(set);
            dump_error(saved_errno);
            printf("\n");
            continue;
        }

        printf("invalid: %s\n", buf);
        printf("use bin:10101 or range:1-10\n");
        printf("\n");
    }
}
