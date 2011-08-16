//
//  CoreDataError.m
//  QC Example
//
//  Created by Lee Barney on 3/16/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import "GenericECO.h"


@implementation GenericECO
+ (BOOL) handleIt:(NSMutableDictionary*) parameters{
    UITextView *resultView = [parameters objectForKey:@"resultDisplay"];
    resultView.text = [NSString stringWithFormat:@"%@.  %@.",[parameters objectForKey:@"description"], [parameters objectForKey:@"reason"]];
    return QC_STACK_EXIT;
}
@end
