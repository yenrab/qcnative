//
//  GetRequestBCO.m
//  QC Example
//
//  Created by Lee Barney on 3/16/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import "GetRequestBCO.h"
#import "QCRequestHandler.h"

@implementation GetRequestBCO
+ (QCReturnValue) handleIt:(NSMutableDictionary*) parameters{
    QCRequestHandler *theHandler = [parameters objectForKey:@"qcrequest handler"];
    NSURL *url = [parameters objectForKey:@"url"];
    NSError *error = nil;
    NSString *dataString = [NSString stringWithContentsOfURL:url encoding:NSUTF8StringEncoding error:&error];
    if (error != nil) {
        NSLog(@"error: %@",error);
        [parameters setObject:[error localizedDescription] forKey:@"description"];
        [parameters setObject:@"bad url" forKey:@"reason"];
        [theHandler dispatchToECO:@"genericError" withParameters:parameters];
        return QC_STACK_EXIT;
    }
    [parameters setObject:dataString forKey:@"html"];
    return QC_STACK_CONTINUE;
}
@end
